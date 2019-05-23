export default function (Blockly) {
    /**
     * Computes the height and widths for each row and field.
     * @param {number} iconWidth Offset of first row due to icons.
     * @return {!Array.<!Array.<!Object>>} 2D array of objects, each containing
     *     position information.
     * @private
     */
    Blockly.BlockSvg.prototype.renderCompute_ = function (iconWidth) {
        var inputList = this.inputList;
        var inputRows = [];
        // Block will be drawn from 0 (left edge) to rightEdge, in px.
        inputRows.rightEdge = 0;
        // Drawn from 0 to bottomEdge vertically.
        inputRows.bottomEdge = 0;
        var fieldValueWidth = 0;  // Width of longest external value field.
        var fieldStatementWidth = 0;  // Width of longest statement field.
        var hasValue = false;
        var hasStatement = false;
        var hasDummy = false;
        var lastType = undefined;

        // Previously created row, for special-casing row heights on C- and E- shaped blocks.
        var previousRow;
        for (var i = 0, input; input = inputList[i]; i++) {
            if (!input.isVisible()) {
                continue;
            }
            var isSecondInputOnProcedure = this.type == 'procedures_definition' &&
                lastType && lastType == Blockly.NEXT_STATEMENT;
            var row;
            // Don't create a new row for the second dummy input on a procedure block.
            // See github.com/LLK/scratch-blocks/issues/1658
            // In all other cases, statement and value inputs catch all preceding dummy
            // inputs, and cause a line break before following inputs.
            if (!isSecondInputOnProcedure &&
                (!lastType || lastType == Blockly.NEXT_STATEMENT ||
                    input.type == Blockly.NEXT_STATEMENT)) {
                lastType = input.type;
                row = this.createRowForInput_(input);
                inputRows.push(row);
            } else if (this.shouldCreateMultiRow &&
                lastType === Blockly.DUMMY_INPUT) {
                lastType = input.type;
                row = this.createRowForInput_(input);
                inputRows.push(row);
            } else {
                lastType = input.type;
                row = inputRows[inputRows.length - 1];
            }
            row.push(input);

            // Compute minimum dimensions for this input.
            input.renderHeight = this.computeInputHeight_(input, row, previousRow);
            input.renderWidth = this.computeInputWidth_(input);

            // If the input is a statement input, determine if a notch
            // should be drawn at the inner bottom of the C.
            row.statementNotchAtBottom = true;
            if (input.connection && input.connection.type === Blockly.NEXT_STATEMENT) {
                var linkedBlock = input.connection.targetBlock();
                if (linkedBlock && !linkedBlock.lastConnectionInStack()) {
                    row.statementNotchAtBottom = false;
                }
            }

            // Expand input size.
            if (input.connection) {
                var linkedBlock = input.connection.targetBlock();
                var paddedHeight = 0;
                var paddedWidth = 0;
                if (linkedBlock) {
                    // A block is connected to the input - use its size.
                    var bBox = linkedBlock.getHeightWidth();
                    paddedHeight = bBox.height;
                    paddedWidth = bBox.width;
                } else {
                    // No block connected - use the size of the rendered empty input shape.
                    paddedHeight = Blockly.BlockSvg.INPUT_SHAPE_HEIGHT;
                }
                if (input.connection.type === Blockly.INPUT_VALUE) {
                    paddedHeight += 2 * Blockly.BlockSvg.INLINE_PADDING_Y;
                }
                if (input.connection.type === Blockly.NEXT_STATEMENT) {
                    // Subtract height of notch, only if the last block in the stack has a next connection.
                    if (row.statementNotchAtBottom) {
                        paddedHeight -= Blockly.BlockSvg.NOTCH_HEIGHT;
                    }
                }
                input.renderHeight = Math.max(input.renderHeight, paddedHeight);
                input.renderWidth = Math.max(input.renderWidth, paddedWidth);
            }
            row.height = Math.max(row.height, input.renderHeight);
            input.fieldWidth = 0;
            if (inputRows.length == 1) {
                // The first row gets shifted to accommodate any icons.
                input.fieldWidth += this.RTL ? -iconWidth : iconWidth;
            }
            var previousFieldEditable = false;
            for (var j = 0, field; field = input.fieldRow[j]; j++) {
                if (j != 0) {
                    input.fieldWidth += Blockly.BlockSvg.SEP_SPACE_X;
                }
                // Get the dimensions of the field.
                var fieldSize = field.getSize();
                field.renderWidth = fieldSize.width;
                field.renderSep = (previousFieldEditable && field.EDITABLE) ?
                    Blockly.BlockSvg.SEP_SPACE_X : 0;
                // See github.com/LLK/scratch-blocks/issues/1658
                if (!isSecondInputOnProcedure) {
                    input.fieldWidth += field.renderWidth + field.renderSep;
                }
                row.height = Math.max(row.height, fieldSize.height);
                previousFieldEditable = field.EDITABLE;
            }

            if (row.type != Blockly.BlockSvg.INLINE) {
                if (row.type == Blockly.NEXT_STATEMENT) {
                    hasStatement = true;
                    fieldStatementWidth = Math.max(fieldStatementWidth, input.fieldWidth);
                } else {
                    if (row.type == Blockly.INPUT_VALUE) {
                        hasValue = true;
                    } else if (row.type == Blockly.DUMMY_INPUT) {
                        hasDummy = true;
                    }
                    fieldValueWidth = Math.max(fieldValueWidth, input.fieldWidth);
                }
            }
            previousRow = row;
        }
        // Compute padding for output blocks.
        // Data is attached to the row.
        this.computeOutputPadding_(inputRows);
        // Compute the statement edge.
        // This is the width of a block where statements are nested.
        inputRows.statementEdge = Blockly.BlockSvg.STATEMENT_INPUT_EDGE_WIDTH +
            fieldStatementWidth;

        // Compute the preferred right edge.
        inputRows.rightEdge = this.computeRightEdge_(inputRows.rightEdge,
            hasStatement);

        // Bottom edge is sum of row heights
        for (var i = 0; i < inputRows.length; i++) {
            inputRows.bottomEdge += inputRows[i].height;
        }

        inputRows.hasValue = hasValue;
        inputRows.hasStatement = hasStatement;
        inputRows.hasDummy = hasDummy;
        return inputRows;
    };

    /**
     * Render the right edge of the block.
     * @param {!Array.<string>} steps Path of block outline.
     * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
     *     containing position information.
     * @param {number} iconWidth Offset of first row due to icons.
     * @return {number} Height of block.
     * @private
     */
    Blockly.BlockSvg.prototype.renderDrawRight_ = function (steps,
        inputRows, iconWidth) {
        var cursorX = 0;
        var cursorY = 0;
        var connectionX, connectionY;
        for (var y = 0, row; row = inputRows[y]; y++) {
            cursorX = row.paddingStart;
            if (y == 0) {
                cursorX += this.RTL ? -iconWidth : iconWidth;
            }

            if (row.type == Blockly.BlockSvg.INLINE) {
                // Inline inputs.
                for (var x = 0, input; input = row[x]; x++) {
                    // Align fields vertically within the row.
                    // Moves the field to half of the row's height.
                    // In renderFields_, the field is further centered
                    // by its own rendered height.
                    var fieldY = cursorY + row.height / 2;

                    var fieldX = Blockly.BlockSvg.getAlignedCursor_(cursorX, input,
                        inputRows.rightEdge);

                    cursorX = this.renderFields_(input.fieldRow, fieldX, fieldY);
                    if (input.type == Blockly.INPUT_VALUE) {
                        // Create inline input connection.
                        // In blocks with a notch, inputs should be bumped to a min X,
                        // to avoid overlapping with the notch.
                        if (this.previousConnection) {
                            cursorX = Math.max(cursorX, Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X);
                        }
                        connectionX = this.RTL ? -cursorX : cursorX;
                        // Attempt to center the connection vertically.
                        var connectionYOffset = row.height / 2;
                        connectionY = cursorY + connectionYOffset;
                        input.connection.setOffsetInBlock(connectionX, connectionY);
                        this.renderInputShape_(input, cursorX, cursorY + connectionYOffset);
                        cursorX += input.renderWidth + Blockly.BlockSvg.SEP_SPACE_X;
                    }
                }
                // Remove final separator and replace it with right-padding.
                cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
                cursorX += row.paddingEnd;
                // Update right edge for all inputs, such that all rows
                // stretch to be at least the size of all previous rows.
                inputRows.rightEdge = Math.max(cursorX, inputRows.rightEdge);
                // Move to the right edge
                cursorX = Math.max(cursorX, inputRows.rightEdge);
                this.width = Math.max(this.width, cursorX);
                if (!this.edgeShape_) {
                    // Include corner radius in drawing the horizontal line.
                    steps.push('H', cursorX - Blockly.BlockSvg.CORNER_RADIUS - this.edgeShapeWidth_);
                    steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
                } else {
                    // Don't include corner radius - no corner (edge shape drawn).
                    steps.push('H', cursorX - this.edgeShapeWidth_);
                }
                // Subtract CORNER_RADIUS * 2 to account for the top right corner
                // and also the bottom right corner. Only move vertically the non-corner length.
                if (!this.edgeShape_) {
                    steps.push('v', row.height - Blockly.BlockSvg.CORNER_RADIUS * 2);
                }
                if (this.shouldCreateMultiRow) cursorY -= Blockly.BlockSvg.SEP_SPACE_Y / 2.2;
            } else if (row.type == Blockly.NEXT_STATEMENT) {
                // Nested statement.
                var input = row[0];
                var fieldX = cursorX;
                // Align fields vertically within the row.
                // In renderFields_, the field is further centered by its own height.
                var fieldY = cursorY;
                fieldY += Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
                this.renderFields_(input.fieldRow, fieldX, fieldY);
                // Move to the start of the notch.
                cursorX = inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH;

                if (this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE) {
                    this.renderDefineBlock_(steps, inputRows, input, row, cursorY);
                } else {
                    Blockly.BlockSvg.drawStatementInputFromTopRight_(steps, cursorX,
                        inputRows.rightEdge, row);
                }

                // Create statement connection.
                connectionX = this.RTL ? -cursorX : cursorX;
                input.connection.setOffsetInBlock(connectionX, cursorY);
                if (input.connection.isConnected()) {
                    this.width = Math.max(this.width, inputRows.statementEdge +
                        input.connection.targetBlock().getHeightWidth().width);
                }
                if (this.type != Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE &&
                    (y == inputRows.length - 1 ||
                        inputRows[y + 1].type == Blockly.NEXT_STATEMENT)) {
                    // If the final input is a statement stack, add a small row underneath.
                    // Consecutive statement stacks are also separated by a small divider.
                    steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
                    steps.push('v', Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y - 2 * Blockly.BlockSvg.CORNER_RADIUS);
                    cursorY += Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y;
                }
            }
            cursorY += row.height;
        }
        this.drawEdgeShapeRight_(steps);
        if (!inputRows.length) {
            cursorY = Blockly.BlockSvg.MIN_BLOCK_Y;
            steps.push('V', cursorY);
        }
        return cursorY;
    };

    /**
     * Render the block.
     * Lays out and reflows a block based on its contents and settings.
     * @param {boolean=} opt_bubble If false, just render this block.
     *   If true, also render block's parent, grandparent, etc.  Defaults to true.
     */
    Blockly.BlockSvg.prototype.render = function (opt_bubble) {
        Blockly.Field.startCache();
        this.rendered = true;

        var cursorX = Blockly.BlockSvg.SEP_SPACE_X;
        if (this.RTL) {
            cursorX = -cursorX;
        }
        // Move the icons into position.
        var icons = this.getIcons();
        var scratchCommentIcon = null;
        for (var i = 0; i < icons.length; i++) {
            if (icons[i] instanceof Blockly.ScratchBlockComment) {
                // Don't render scratch block comment icon until
                // after the inputs
                scratchCommentIcon = icons[i];
            } else if (icons[i] instanceof Blockly.Mutator) { // 忽略mutator
                continue;
            } else {
                cursorX = icons[i].renderIcon(cursorX);
            }
        }
        cursorX += this.RTL ?
            Blockly.BlockSvg.SEP_SPACE_X : -Blockly.BlockSvg.SEP_SPACE_X;
        // If there are no icons, cursorX will be 0, otherwise it will be the
        // width that the first label needs to move over by.

        // If this is an extension reporter block, add a horizontal offset.
        if (this.isScratchExtension && this.outputConnection) {
            cursorX += this.RTL ?
                -Blockly.BlockSvg.GRID_UNIT : Blockly.BlockSvg.GRID_UNIT;
        }

        var inputRows = this.renderCompute_(cursorX);
        this.renderDraw_(cursorX, inputRows);
        this.renderMoveConnections_();

        this.renderClassify_();

        // Position the Scratch Block Comment Icon at the end of the block
        if (scratchCommentIcon) {
            var iconX = this.RTL ? -inputRows.rightEdge : inputRows.rightEdge;
            var inputMarginY = inputRows[0].height / 2;
            scratchCommentIcon.renderIcon(iconX, inputMarginY);
        }

        if (opt_bubble !== false) {
            // Render all blocks above this one (propagate a reflow).
            var parentBlock = this.getParent();
            if (parentBlock) {
                parentBlock.render(true);
            } else {
                // Top-most block.  Fire an event to allow scrollbars to resize.
                Blockly.resizeSvgContents(this.workspace);
            }
        }
        Blockly.Field.stopCache();
    };

    // 不让mutator创建dom
    Blockly.Mutator.prototype.drawIcon_ = function () { };

}