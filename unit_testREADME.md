| Test Case ID | Module Name          | Test Description                                                           | Expected Result                                    | Actual Result| Status  |
|--------------|----------------------|----------------------------------------------------------------------------|-------------------------------------------------- -|--------------|---------|
| TC001        | App Endpoints        | Verify `/health` endpoint responds with status                             | HTTP 200 with service healthy message              | pass         | pass    |
| TC002        | App Endpoints        | Test `/vxml/webhook` POST with valid VXML payload                          | Returns valid canonical format JSON                | pass         | pass    |
| TC003        | App Endpoints        | Test `/nlu/process` for rule-based intent parsing                          | Detects expected intents and entities              | pass         | pass    |
| TC004        | App Endpoints        | Test `/flows` endpoint retrieves or validates available flows              | Returns proper JSON contract for flow files        | pass         | pass    |
| TC005        | App Endpoints        | Test `/audio/process` – upload in-memory bytes file                        | Accepts file, cleans up after test                 | pass         | pass    |
| TC006        | NLU                  | Rule-based parser handles representative utterance                         | Parse result matches desired intent/entity mapping | pass         | pass    |
| TC007        | Session Store        | SessionStore creates, appends history, retrieves session                   | All operations behave as expected                  | pass         | pass    |
| TC008        | VXML Adapter         | `to_canonical` and `from_canonical` correctly map rules                    | Output matches mapping rules for round-trip        | pass         | pass    |
| TC009        | Flows JSON Contract  | Validate flow JSON contract for files in `flows/converted`                 | Contract matches design specification              | pass         | pass    |
