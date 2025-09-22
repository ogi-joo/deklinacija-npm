declare namespace Deklinacija {
  export interface Result {
    name: string;
    sex?: 'male' | 'female' | string;
    vocative?: string;
    vocativeCyr?: string;
    found: boolean;
  }
}

declare function dekl(name: string): Deklinacija.Result;

declare namespace dekl {
  export function toCyrillic(input: string): string;
}

export = dekl;

