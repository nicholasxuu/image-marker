# Image Marker

A React component to mark and tag items in an image.

## Purpose

Given an image, it will load the image into a svg container (make it pan/zoom capable).
Then let user to place boxes in the image and tag the area with custom message.
Eventually, user can save all the marked items.

## Details

- Most of the app is written as a dumb component, with no dependency of redux.
- Redux is only used as an outer layer, to read query in URL for input, and contact backend API for output.
- Disabled touch actions, not that useful for the use case (too inaccurate and slow).
- All result in output are at same pixel scale as the image.

## TODOs

- Add rotate capability
- Add selected rectangle dimension adjustment capability.
- Add API fetch feedback in display.
- Add sample API.

## Packages

- create-react-app related stuff.
- Redux
- ImmutableJS
- react-router-redux, query-string
- redux-logger, history
- redux-thunk, isomorphic-fetch
- styled-components

- jest
- eslint, eslint-config-airbnb: code style
- enzyme: integration test
- fetch-mock: for tests with network
- redux-mock-store

## Scripts

- Basic ones from create-react-app: start, build, test, eject
- Upgraded build, for easy build with different .env files.
