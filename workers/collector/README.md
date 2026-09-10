# workers/collector

Worker scripts for heavy OSINT gathering tasks that run outside the
request/response cycle.

## Suggested stack

- Node.js 20+ workers (BullMQ / Temporal)
- Python workers for scraping / NLP (Celery, Scrapy)

## Responsibilities

- Scheduled dark web scans
- Bulk IOC enrichment
- Social media monitoring pulls
- Geospatial data aggregation

## Development

```bash
cd workers/collector
npm install   # or pip install -r requirements.txt
npm run dev
```
