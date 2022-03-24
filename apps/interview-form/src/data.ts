export const defaultTakeHomeFeedbackData = (
  cardId: string,
  username: string,
) => ({
  cardId: cardId,
  id: `${cardId}${username}TakeHomefeedback`,
  stateStr: 'WorkflowStateTakeHomeReview',
  summary: '<p></p>',
  questions: [
    {
      question: 'Precision and correctness',
      response: '<p></p>',
      description:
        'Example description: the solution shows care in handling results and discuss implications of linear search. It includes ideas for improvements. Tests are complete and readable.',
      preSet: true,
      scoreCardsLabel: 'Scores',
      scoreCards: [
        {
          text: 'Does the code compile?',
          boolean: true,
          preSet: true,
        },
        {
          text: 'Is the program correct?',
          description: 'does it return the expected results?',
          preSet: true,
        },
        {
          text: 'If there are unit tests, are they running correctly?',
          description:
            'Keep in mind that there could be green tests which are however not testing the right thing',
          preSet: true,
        },
        {
          text: 'Does it handle edge cases?',
          description:
            'Use some creativity to check wrong inputs or other common pitfalls',
          preSet: true,
        },
      ],
    },
    {
      question: 'Organization and strategy',
      response: '<p></p>',
      description:
        'Example description: solution is generally well organized. Solid choice of data structures keeps complexity low, for example the small state machine, or using a sorted-set of maps to enable easy date comparisons.',
      preSet: true,
      scoreCardsLabel: 'Scores',
      scoreCards: [
        {
          text: 'Is the program designed well?',
          preSet: true,
        },
        {
          text: 'Is there a separation of concerns between input parsing, presentation and business logic?',
          preSet: true,
        },
        {
          text: 'Are the unit tests easy to follow?',
          preSet: true,
        },
        {
          text: 'Is there an effort to handle error situations?',
          preSet: true,
        },
        {
          text: 'Is the program appropriatly simple? Answer no if it suffers from over-engineering',
          description:
            'see https://www.pullrequest.com/blog/signs-what-youre-building-is-over-engineered/',
          preSet: true,
        },
      ],
    },
    {
      question: 'Documentation and code readability',
      response: '<p></p>',
      description:
        'Example description: the code is written with readability in mind and with the idea that someone would need to understand it. As a tiny minor, would have appreciated an example of usage in the README which was instead in the core namespace.',
      preSet: true,
      scoreCardsLabel: 'Scores',
      scoreCards: [
        {
          text: 'Does the program comes with some kind of instructions?',
          preSet: true,
        },
        {
          text: 'Are methods/functions vaguely documented?',
          preSet: true,
        },
        {
          text: 'Is it easy to put the program in running condition?',
          preSet: true,
        },
        {
          text: 'Is the code readable?',
          description:
            'Answer no even if the code works but is overly complex and would be difficult to understand if viewed by a relitively inexperienced person',
          preSet: true,
        },
      ],
    },
    {
      question: 'Skill and experience',
      response: '<p></p>',
      description:
        'Example description: the candidate shows idiomatic use of Clojure, an eye for simplicity and some good use of sorted-set which is not necessarily common. Only minor was using a declare for apparently no reasons and perhaps could have used subseq instead of take-while to take advantage of log(N) search.',
      preSet: true,
      scoreCardsLabel: 'Scores',
      scoreCards: [
        {
          text: 'Is the developer paying attention to performance, either through the code or documentation?',
          preSet: true,
        },
        {
          text: 'Is the code organised in a way you would expect from an experienced engineer',
          preSet: true,
        },
        {
          text: 'Is the code idiomatic?',
          preSet: true,
        },
        {
          text: 'Does the candidate show a good understanding of FP practices',
          preSet: true,
        },
      ],
    },
  ],
});

export const defaultStage1FeedbackData = (
  cardId: string,
  username: string,
) => ({
  cardId: cardId,
  id: `${cardId}${username}stage1feedback`,
  stateStr: 'WorkflowStateAwaitStage1IV',
  summary: '<p></p>',
  questions: [
    {
      question: 'Tell us about yourself',
      response: '<p></p>',
      description: 'looking for x y z',
      preSet: true,
      scoreCardsLabel: 'First Impression',
      scoreCards: [
        {
          text: 'Communication skills',
          description:
            'Will they communicate well with clients and colleagues?',
          preSet: true,
        },
        {
          text: 'Evidence of passion',
          description: 'Do they have passion for their work?',
          preSet: true,
        },
      ],
    },
    {
      question:
        'Describe the type of work environment in which you are most productive.',
      response: '<p></p>',
      description:
        'See if they are ok with remote, also use this to guage consulting vs t1',
      preSet: true,
      scoreCardsLabel: 'Soft Skills',
      scoreCards: [
        {
          text: 'Collaborative',
          preSet: true,
        },
        {
          text: 'Takes ownership',
          preSet: true,
        },
        {
          text: 'Passion',
          preSet: true,
        },
      ],
    },
  ],
});

export const defaultPPFeedbackData = (cardId: string, username: string) => ({
  cardId: cardId,
  id: `${cardId}${username}PPfeedback`,
  stateStr: 'WorkflowStateAwaitStage1IV',
  summary: '<p></p>',
  questions: [
    {
      question: 'Explain the code you wrote for the take home',
      response: '<p></p>',
      preSet: true,
      scoreCardsLabel: 'Scores',
      scoreCards: [
        {
          text: 'Do you feel like they actually wrote the code',
          description:
            'look for signs they copied from the internet or got someone else to write it',
          preSet: true,
        },
        {
          text: 'Can they identify their own mistakes',
          preSet: true,
        },
      ],
    },
  ],
});
