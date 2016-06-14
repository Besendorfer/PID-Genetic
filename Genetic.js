'use strict';

class Genetic {
	constructor(crossOver = 0.7,
				mutation = 0.03,
				elitism = 1,
				populationSize = 15) {

		this.crossOverPoints = 1;
		this.crossOver = crossOver;
		this.mutation = mutation;
		this.elitism = elitism;
		this.populationSize = populationSize;

		// jscs:disable requireSpaceAfterBinaryOperators
		this.population = [
			[3,0,0,0,8,6,  2,0,0,0,  2,0,0,7,9,0,  0,0,0,0],
			[5,0,0,0,5,7,  2,0,1,0,  4,2,0,7,9,1,  0,0,2,0],
			[3,0,0,0,5,6,  2,0,1,0,  2,2,0,7,9,1,  0,0,0,0]
		];
		// jscs:enable

		this.genesLength = this.population[0].length;
		this.fillPopulation(this.populationSize);

		this.testQueue = this.population.slice();
	}

	fillPopulation(populationSize) {
		let preSet = this.population.length;
		for (let i = preSet; i < populationSize; i++) {
			let randomPreset = Math.random() * preSet >>> 0;
			let mold = this.population[randomPreset].slice();
			for (let j = 0; j < 5; j++) {
				this.mutate(mold);
			}
			this.population.push(mold);
		}
	}

	nextGeneration() {
		this.population.sort((a, b) => b.fitness - a.fitness);
		console.log('elite', this.population[0]);
		this.kill();
		this.matchmaker();
		this.mutatePopulation();
		this.fillPopulation(this.populationSize);
	}

	matchmaker() {
		let breeders = [];
		let sumFit = 0;
		let numCandidates = this.population.length;
		for (let i = 0; i < numCandidates; i++) {
			if (i < this.elitism)
				continue;
			if (this.crossOver < Math.random())
				continue;

			breeders.push(this.population[i]);
			if (this.population.length < this.populationSize) {
				this.population.push(this.population[i].slice());
			}
			sumFit += this.population[i].fitness;
		}

		while (breeders.length > 1) {
			let father = breeders.shift();

			sumFit -= father.fitness;
			let mother = Math.random() * sumFit;
			for (let j = 0; j < breeders.length; j++) {
				mother -= breeders[j].fitness;
				if (mother <= 0) {
					this.breed(father, breeders.splice(j, 1)[0]);
					break;
				}
			}
		}
	}

	breed(father, mother) {
		for (let i = 0; i < this.crossOverPoints; i++) {
			let crossOverPoint = (Math.random() * this.genesLength) >>> 0;
			let isCrossing = Math.random() < 0.5;
			for (let j = 0; j < this.genesLength; j++) {
				if (j === crossOverPoint) {
					isCrossing = !isCrossing;
				}
				if (isCrossing) {
					let temp = mother[j];
					mother[j] = father[j];
					father[j] = temp;
				}
			}
		}
		father.fitness = undefined;
		mother.fitness = undefined;
	}

	kill() {
		let sumFit = this.population.map((e) => e.fitness)
									.reduce((total, next) => total + next);
		for (let i = this.population.length - 1; i >= this.elitism; i--) {
			if (this.population[i].fitness / sumFit < Math.random() / 10) {
				this.population.splice(i, 1);
			}
		}
	}

	mutatePopulation() {
		for (let i = this.elitism; i < this.population.length; i++) {
			if (Math.random() < this.mutation) {
				this.mutate(this.population[i]);
			}
		}
	}

	mutate(individual) {
		let mutatePoint = (Math.random() * this.genesLength) >>> 0;
		let mutateAmount = ((Math.random() * 6) >>> 0) - 3;
		individual[mutatePoint] += mutateAmount;

		if (individual[mutatePoint] < 0 || individual[mutatePoint] > 9) {
			individual[mutatePoint] -= mutateAmount;
		}

		individual.fitness = undefined;
	}

	reportFitness(fitness) {
		console.log('reportFitness:', fitness);
		this.testQueue.shift().fitness = fitness;

		if (this.testQueue.length === 0) {
			this.nextGeneration();
			this.testQueue = this.population.slice();
		}
	}

	nextCandidate() {
		while (this.testQueue[0].fitness != null) {
			this.reportFitness(this.testQueue[0].fitness);
		}

		return this.fromGenes(this.testQueue[0]);
	}

	// hardcode method for speed
	fromGenes(genes) {
		return [
			genes[ 0] / 1e1 +
			genes[ 1] / 1e2 +
			genes[ 2] / 1e3 +
			genes[ 3] / 1e4 +
			genes[ 4] / 1e5 +
			genes[ 5] / 1e6,

			genes[ 6] / 1e5 +
			genes[ 7] / 1e6 +
			genes[ 8] / 1e7 +
			genes[ 9] / 1e8,

			genes[10] * 1e1 +
			genes[11] * 1e0 +
			genes[12] / 1e1 +
			genes[13] / 1e2 +
			genes[14] / 1e3 +
			genes[15] / 1e4,

			genes[16] * 1e0 +
			genes[17] / 1e1 +
			genes[18] / 1e2 +
			genes[19] / 1e3
		];
	}
}

module.exports = Genetic;
