# Signal Flare

Signal Flare is a developer workflow automation tool. It runs a websocket server that allows processes in different contexts to discover each other and coordinate work, and provides a command-line interface for instrumenting and interacting with these processes and workflows.

## Getting Started

 - `git clone https://github.com/radify/signal-flare.git; cd signal-flare`
 - `yarn`
 - `yarn start`

## Goals

 - Discover other Signal Flare servers on the local network, and expose them (with 'friendly' user names) through various interfaces, i.e. a Chrome extension
 - Allow developers to 'pair' by mirroring each other's Git branch, working copy changes, and browser environment
 - Bi-directional working copy sync using `diff` & `stash`
 - Provide transactional syncing for remote users sharing a Slack channel, using Slack messages with embedded buttons

## Notes

 - To check if a merge will cause conflicts: `git merge --no-commit --no-ff $BRANCH`
 - To check if a patch will cause conflicts: `git apply <file> --check`
 - Git SHA for objects: [`git ls-tree master -lrt`](http://alblue.bandlem.com/2011/08/git-tip-of-week-objects.html)