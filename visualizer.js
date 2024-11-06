class Visualizer {
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {NeuralNetwork} network
   */
  static drawNetwork(ctx, network) {
    const margin = 50;
    const left = margin;
    const top = margin;
    const width = ctx.canvas.width - margin*2;
    const height = ctx.canvas.height - margin*2;

    const levelHeight = height / network.levels.length;

    for (let i = network.levels.length - 1; i >= 0; i--) {
      const levelTop = top +
        lerp(
          height - levelHeight,
          0,
          network.levels.length === 1
            ? 0.5
            : i / (network.levels.length - 1)
        );

      ctx.setLineDash([7, 3]);
      Visualizer.drawLevel(ctx, network.levels[i],
        left, levelTop,
        width, levelHeight,
        i === network.levels.length - 1
          ? ['\u2191', '\u2190', '\u2192', '\u2193']
          : [],
      );
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   * @param {Level} level
   * @param {number} left
   * @param {number} top
   * @param {number} width
   * @param {number} height
   * @param {string[]} outputLabels
   */
  static drawLevel(ctx, level, left, top, width, height, outputLabels) {
    const right = left + width;
    const bottom = top + height;

    const { inputs, outputs, weights, biases } = level;

    const nodeRadius = 18;

    // draw weights (connections between inputs and outputs)
    for (let i = 0 ; i < inputs.length; i++) {
      for (let j = 0 ; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(
          Visualizer.#getNodeX(inputs, i, left, right),
          bottom,
        );

        ctx.lineTo(
          Visualizer.#getNodeX(outputs, j, left, right),
          top,
        );

        ctx.lineWidth = 2;
        ctx.strokeStyle = getRGBA(weights[i][j]);
        ctx.stroke();
      }
    }

    // draw inputs
    for (let i = 0 ; i < inputs.length; i++) {
      const x = Visualizer.#getNodeX(inputs, i, left, right);

      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0 , Math.PI*2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0 , Math.PI*2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
    }

    // draw outputs
    for (let i = 0 ; i < outputs.length; i++) {
      const x = lerp(
        left,
        right,
        outputs.length === 0 ? 0.5 : i / (outputs.length - 1),
      );

      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0 , Math.PI*2);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0 , Math.PI*2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();

      // draw circle around output to represent biases
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI*2);
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLabels[i]) {
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.font = `${nodeRadius * 1.5}px Arial`;
        ctx.fillText(outputLabels[i], x, top + nodeRadius*0.1);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputLabels[i], x, top + nodeRadius*0.1);
      }
    }
  }

  /**
   * Get x coordinate of given node
   * @param {number[]} nodes
   * @param {number} index
   * @param {number} left
   * @param {number} right
   * @returns {number} - x coordinate of node
   */
  static #getNodeX(nodes, index, left, right) {
    return lerp(
      left,
      right,
      nodes.length === 1
        ? 0.5
        : index / (nodes.length - 1),
    );
  }
}
