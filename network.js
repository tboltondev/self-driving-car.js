/**
 * @typedef {1 | 0} Output
 */

class NeuralNetwork {
  /**
   * @param {number[]} neuronCounts - number of neurons in each level
   */
  constructor(neuronCounts) {
    this.levels = [];
    for (let i = 0; i < neuronCounts.length - 1; i++) {
      this.levels.push(new Level(
        neuronCounts[i], neuronCounts[i + 1]
      ));
    }
  }

  /**
   * Calculates the outputs of the neural network for a set of given inputs
   * @param {number[]} givenInputs - input values to the network
   * @param {NeuralNetwork} network - the neural network instance
   * @returns {Output[]} - neural network outputs
   */
  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(
      givenInputs, network.levels[0]
    );
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(
        outputs, network.levels[i]
      );
    }

    return outputs;
  }
}

class Level {
  /**
   * @param {number} inputCount - number of input neurons
   * @param {number} outputCount - number of output neurons
   */
  constructor (inputCount, outputCount) {
    /** @type {number[]} */
    this.inputs = new Array(inputCount);
    /** @type {Output[]} */
    this.outputs = new Array(outputCount);
    /** values above which each output neuron will fire */
    this.biases = new Array(outputCount);

    /** values associated with each input to output neuron connection  */
    this.weights = [];
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount);
    }

    Level.#randomize(this);
  }

  /**
   * Randomizes weights and biases for a given neural network level
   * @param {Level} level
   */
  static #randomize(level) {
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random()*2 - 1; // -1 to 1
      }
    }

    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random()*2 - 1; // -1 to 1
    }
  }

  /**
   * Calculates of the outputs of the level for the given inputs
   * @param {number[]} givenInputs - input values to the level
   * @param {Level} level - the level instance
   * @returns {Output[]} - level outputs
   */
  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i];
    }

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i]; // input val * weight
      }

      if (sum > level.biases[i]) {
        level.outputs[i] = 1; // output neuron ON
      } else {
        level.outputs[i] = 0; // output neuron OFF
      }
    }

    return level.outputs;
  }
}