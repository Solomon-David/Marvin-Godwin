class Question {
    constructor(text, options, scoring) {
      this.text = text;
      this.options = options;
      this.scoring = scoring;
    }
  
    rankAnswer(userAnswer) {
      // Find the index of the user's answer in the options array
      const answerIndex = this.options.indexOf(userAnswer);
  
      // If the answer is not found, return a default rank (e.g., 0)
      if (answerIndex === -1) {
        return 0;
      }
  
      // Return the corresponding score from the scoring array
      return this.scoring[answerIndex];
    }
  }

// some questions
  const depressionQuestions = [
    new Question("Have you often felt down, depressed, or hopeless?", ["Rarely", "Sometimes", "Often", "Almost always"], [1, 2, 3, 4]),
    new Question("Have you lost interest in activities you used to enjoy?", ["Not at all", "A little", "Somewhat", "A lot"], [1, 2, 3, 4]),
    new Question("Have you experienced changes in your appetite or weight?", ["Not at all", "A little", "Somewhat", "A lot"], [1, 2, 3, 4]),
    new Question("Have you had trouble sleeping or sleeping too much?", ["Rarely", "Sometimes", "Often", "Almost always"], [1, 2, 3, 4]),
    new Question("Have you felt fatigued or had little energy?", ["Rarely", "Sometimes", "Often", "Almost always"], [1, 2, 3, 4]),
    new Question("Have you felt worthless or guilty?", ["Rarely", "Sometimes", "Often", "Almost always"], [1, 2, 3, 4]),
    new Question("Have you had difficulty concentrating or making decisions?", ["Rarely", "Sometimes", "Often", "Almost always"], [1, 2, 3, 4]),
    new Question("Have you thought about death or suicide?", ["Rarely", "Sometimes", "Often", "Almost always"], [1, 2, 3, 4])
  ];