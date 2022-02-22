# Sonos Challenge

## Technical Stack

### Backend

The backend is developed in __python__ > 3.7 and uses the framework [Sanic](https://sanic.dev/en/) as web framework.
This framework is very light to start, so great for microservices running on kubernetes for example.
It's also asynchronous, it means that request cannot be stuck waiting for a I/O for example.
The testing framework for __Sanic__ is compatible with __pytest__ which is the library used for unit tests.

Backend is stateless and respects the REST standard.

I also use the typing support for python to be able to do static type checking [mypy](http://mypy-lang.org/).

### Database

For the database, we use Mysql. There is no technical reason for this choice.
I tried also __postgresql__ but as I never used Mysql before, I thought it was a good opportunity to test it.

### frontend

The frontend is developed in React and typescript. I used typescript instead of javascript because it's more robust
in term of maintainability, evolution and correction.
For the state management, I used __redux__.
As there are many async request in the frontend, I used __redux-thunk__ for async redux usage. I could also used
__redux-saga__ but as for the database, I never used __redux-thunk__ before and I was interested to test.

## Run the application

The complete application can be start using [docker-compose](https://docs.docker.com/compose/).
First follow the instruction on the website to install __docker-compose__

Once it's done, go into the root folder (at the same level that __docker-compose.yaml__) and simply run:
```
docker-compose up --build
```

Docker images should be built and every container (database, backend and frontend) must be started.

## Code quality and unit tests

### Backend

Python code respect all the rules of [flake8](https://flake8.pycqa.org/en/latest/) and rules of [pylint](https://pylint.org/) (except comment rules).
For static type check, I used [mypy](http://mypy-lang.org/) (all typing are correct except in __tests__ folder).
To check the code:

####Flake8
```
pip3 install flake8
flake8 --exclude=venv,tests --max-line-length=120 .
```

####pylint
```
pip3 install pylint
pylint $(find . -type f -name "*.py" ! -path './venv/*' ! -path './tests/*')
```

####mypy
```
pip3 install mypy
mypy . --exclude venv
```

####Unit tests
```
pip3 install pytests pytest-cov
pytest tests/
```

### Frontend

For code quality, we use typescript version of __eslint__ and the Airbnb ruleset. To run the code quality analysis:
```
npm run lint
```

## Idea and Work to do

### Robustness

- Add more unit tests in backend, better exception handling
- Add unit tests in frontend
- Add error handling in frontend for requests

### Usability and Ergonomy

- Add authentification system to be able to have roles for user (admin, operator)
- Add zoom in and zoom out for the audio viewer to be able to be more accurate
- Add drag to move tick on the viewer
- Use a CSS ninja to fix all glitches

### Bugs

- In the file upload modal, scroll doesn't work when the list is higher than the parent component
