# Reddit Eval Dataset

This directory contains evaluation data fetched from r/UPSers for testing ShopTalk's contract Q&A capabilities.

## Quick Start

**No API credentials required!** The script uses Reddit's public `.json` endpoints.

```bash
# Fetch all data (~30-45 minutes)
pnpm eval:fetch

# Test with a single query first
pnpm eval:fetch --query "grievance" --limit 20

# View statistics
pnpm eval:stats
```

## How It Works

Reddit exposes public JSON endpoints by appending `.json` to any URL:
- `https://old.reddit.com/r/UPSers/search.json?q=grievance`
- `https://old.reddit.com/r/UPSers/top.json?t=all`
- `https://old.reddit.com/r/UPSers/comments/{post_id}.json`

This approach:
- **No API credentials needed** - just HTTP requests with a User-Agent
- **Rate limited**: ~10 requests/minute (conservative to avoid 429s)
- **Pagination works**: Uses `after` parameter for multiple pages
- **Legal**: Public data, respectful rate limiting

## CLI Commands

```bash
# Full fetch (all search queries + /new + /top)
pnpm eval:fetch

# Single query test
pnpm eval:fetch --query "grievance" --limit 20

# View statistics
pnpm eval:stats

# Resume interrupted fetch
pnpm eval:fetch --resume

# Dry run (analyze without writing files)
pnpm eval:fetch --dry-run
```

## Directory Structure

```
data/eval/
├── reddit-raw/                # Raw fetched batches
│   └── batch-{timestamp}.json
├── reddit-questions.jsonl     # Processed dataset
├── reddit-metadata.json       # Statistics & config
└── annotated/                 # For ground truth annotation
    └── eval-set-v1.jsonl
```

## Dataset Schema

Each entry in `reddit-questions.jsonl` contains:

```typescript
{
  id: string;                  // Unique entry ID
  redditPostId: string;        // Original Reddit post ID

  question: {
    text: string;              // Normalized question text
    title: string;             // Original post title
    body: string | null;       // Original post body
    context: string | null;    // Job type, location, etc.
  };

  source: {
    subreddit: "UPSers";
    permalink: string;         // Full Reddit URL
    author: string;
    created_at: string;        // ISO 8601
    flair: string | null;
    score: number;
    upvote_ratio: number;
    num_comments: number;
  };

  answers: [{
    id: string;
    text: string;
    author: string;
    score: number;
    created_at: string;
    is_submitter: boolean;     // Is OP
    has_citation: boolean;     // References contract?
  }];

  classification: {
    isQuestion: boolean;
    isContractRelated: boolean;
    topics: string[];          // ["seniority", "overtime"]
    confidence: number;
  };

  groundTruth: {               // For later annotation
    answer: string | null;
    citations: string[];
    annotatedBy: string | null;
    annotatedAt: string | null;
  };
}
```

## Topics Detected

The system auto-detects these contract topics:

- **seniority**: bids, routes, preferred assignments
- **overtime**: 9.5, forced OT, extra board
- **grievance**: filing, steward, local union
- **wages**: pay rates, progression, raises
- **benefits**: insurance, pension, 401k
- **classification**: 22.4, RPCD, feeder, PT/FT
- **vacation**: holidays, personal days, PTO
- **discipline**: warnings, suspension, termination
- **hours**: guarantees, start times, schedules
- **safety**: injuries, OSHA, weather

## Search Queries Used

The script searches for these terms:

**Primary (contract-specific):**
- contract, master agreement, supplement, article
- grievance, seniority, 9.5, 22.4, RPCD

**Secondary (related topics):**
- overtime, vacation, progression, bid
- steward, union, local, pension
- feeder, package driver, top rate, discipline

## Ground Truth Annotation

After fetching, manually annotate selected entries for evaluation:

1. Open `reddit-questions.jsonl`
2. For each entry you want to use:
   - Write the expected answer based on actual contract text
   - Add specific citations (Document ID, Article, Section)
   - Update `groundTruth.annotatedBy` and `groundTruth.annotatedAt`
3. Save annotated entries to `annotated/eval-set-v1.jsonl`

## Rate Limiting Details

- Uses 6-second delay between requests (~10/min)
- Exponential backoff on 429 errors (10s, 20s, 40s...)
- Stops after 5 consecutive errors to avoid being blocked
- Full fetch takes ~30-45 minutes

## Alternative: Arctic Shift

For historical Reddit data without rate limits, consider [Arctic Shift](https://github.com/ArthurHeitmann/arctic_shift) which provides archived Reddit data with an API and [web interface](https://arctic-shift.photon-reddit.com/).
