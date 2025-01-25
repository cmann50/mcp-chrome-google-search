export interface Link {
  text: string;
  url: string;
}

export interface ParsedContent {
  text: string;
  links: Link[];
}

export interface WebContentOptions {
  includeLinks?: boolean;
}