import { juxters } from '@juxt-home/site';
import shuffle from 'lodash-es/shuffle';

type Mention = {
  name: string;
  github?: string;
  avatar: string;
  staffRecord: {
    juxtcode: string;
  };
};

const MENTION_SUGGESTIONS: Mention[] = shuffle(juxters);

export type { Mention };

export { MENTION_SUGGESTIONS };
