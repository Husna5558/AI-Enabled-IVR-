Agile ML Fraud Detection Project
Overview
This project tracks the end-to-end development of a machine learning-based fraud detection system using agile methodology. The workflow includes data collection, model training, explainability integration, frontend dashboard development, and system deployment.

Sprint Summary
Sprint 1: Data collection and preprocessing for transaction data (User Story US001).

Sprint 2: Training an ML model to predict fraudulent transactions (US002).

Sprint 3: Integrate an LLM for human-readable explanations of fraud predictions (US003).

Sprint 4: Build interactive dashboard & deploy the integrated system; ensure backend/frontend integration and demo deployment (US004, US005).

Key User Stories
US ID	Description	Priority	Status
US001	Collect and preprocess transaction data for training ML model	Must Have	Completed
US002	Train ML model on historical data for fraud prediction	Must Have	Completed
US003	Integrate LLM for explanations of fraud predictions	Should Have	Completed
US004	Develop interactive dashboard for risk results and metrics	Must Have	Completed
US005	Deploy and integrate system for demo environment	Could Have	Completed
Dependencies
All user stories depend on previous dataset availability and successful backend integration.

Sprint Backlog & Impediments
Examples:

Sprint 2 Day 3: Model training slow on large dataset — fixed by sampling.

Sprint 2 Day 4: API 500 error — fixed JSON key.

Sprint 3 Day 2: LLM responses too long — applied prompt optimization.

Sprint 4 Day 1: CORS issue — enabled CORS in Flask backend.

Daily Stand-ups
Track actions like improved documentation, version control for model files, structured prompt writing, and collaborative data cleaning.

Teams: Backend, AI, Frontend.

Retrospection
Continuous improvement tracked via retrospectives: e.g., document preprocessing, version control, prompt evaluation, parallel documentation, weekly integration meetings.

Task Sizing & Effort Tracking
Tasks estimated (0.5–12 hours). Daily pending effort hours are monitored for each user story throughout the duration.



Backend folder contains APIs and model training scripts.

Documentation folder contains setup, data sources, and retrospectives.
