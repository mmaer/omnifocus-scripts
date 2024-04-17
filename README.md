# Omnifocus Scripts

## Plug-Ins 

[Estimate Days](./scripts/estimateDays)\
[Estimate Time](./scripts/estimateTime)\
[Linking](./scripts/linking/)\
[Update Dates And Time](./scripts/updateDatesAndTime/)

If you have any issue or suggestion to update existing plug-in or create the new one. Feel free to reach me out.

## Contact

Mail: kamilkruczek0@gmail.com\
Omni Group Slack: Kamil Kruczek\
Omni Forums: kamilkruczek

## Set up projects

### Prerequisites
- Installed node

### Set up 

1. Run `cp .env.sample .env` in terminal
2. Set `OMNI_FOCUS_SCRIPT_FOLDER` env in `.env` (e.g. `"/Users/UserName/Library/Mobile Documents/iCloud~com~omnigroup~OmniFocus/Documents/Plug-Ins"`)
3. Run `npm install`

### Scripts
- `npm run build` - Builds all scripts
- `npm run buildAndCopy` - Builds and copy plug-ins to your Omnifocus plug-ins directory
- `npm run copy-scripts` - Copy plug-ins to your Omnifcous plug-ins directory
