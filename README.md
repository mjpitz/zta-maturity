# Zero Trust Maturity Model Questionaire

Based on the set of tables found in the [Zero Trust Maturity Model Version 2.0][zta-maturity] document published by
CISA, this questionaire aims to help organizations track, improve, and report on their progress toward their desired
level of trust.

[zta-maturity]: https://www.cisa.gov/sites/default/files/2023-04/CISA_Zero_Trust_Maturity_Model_Version_2_508c.pdf

Current assessment is a single take and then you need to start over again. Would be nice to encode answers as part
of the URL so that assessments can be updated / modified later on. By persisting the state in the URL, you don't
need to worry about a backend. There are currently 40 questions.

1. You could encode an array of numbers. The first number will be a version and then the rest match to the quesitons.
2. Add some additional coding data for each section + function (larger, but less fragile)
3. Full JSON encode (unlikely to fit in the URL)
