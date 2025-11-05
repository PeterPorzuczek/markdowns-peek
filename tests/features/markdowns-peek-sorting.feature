Feature: MarkdownsPeek Sorting

  As a developer
  I want to test the sorting functionality of the MarkdownsPeek library
  So that I can ensure files are sorted correctly with numeric prefixes

  Scenario: Sort files alphabetically with numeric prefixes
    Given I have a MarkdownsPeek instance with sortAlphabetically enabled
    When I set files with numeric prefixes "001 cos", "002 moo", "003 foo"
    And I call sortFilesAlphabetically
    Then the files should be sorted in order "001 cos", "002 moo", "003 foo"

  Scenario: Sort files with numeric prefixes in reverse order
    Given I have a MarkdownsPeek instance with sortAlphabetically and reverseSortOrder enabled
    When I set files with numeric prefixes "001 cos", "002 moo", "003 foo"
    And I call sortFilesAlphabetically
    Then the files should be sorted in order "003 foo", "002 moo", "001 cos"

  Scenario: Sort files with mixed numeric prefixes
    Given I have a MarkdownsPeek instance with sortAlphabetically enabled
    When I set files with mixed numeric prefixes "10 test", "2 alpha", "1 beta", "20 gamma"
    And I call sortFilesAlphabetically
    Then the files should be sorted numerically as "1 beta", "2 alpha", "10 test", "20 gamma"

  Scenario: Sort files with mixed numeric prefixes in reverse order
    Given I have a MarkdownsPeek instance with sortAlphabetically and reverseSortOrder enabled
    When I set files with mixed numeric prefixes "10 test", "2 alpha", "1 beta", "20 gamma"
    And I call sortFilesAlphabetically
    Then the files should be sorted numerically in reverse as "20 gamma", "10 test", "2 alpha", "1 beta"

  Scenario: Sort files without sortAlphabetically option
    Given I have a MarkdownsPeek instance without sortAlphabetically
    When I set files with numeric prefixes "003 foo", "001 cos", "002 moo"
    And I attempt to use the files
    Then the files should remain in original order "003 foo", "001 cos", "002 moo"

  Scenario: Sort files with leading zeros
    Given I have a MarkdownsPeek instance with sortAlphabetically enabled
    When I set files with leading zeros "001-first.md", "010-tenth.md", "002-second.md"
    And I call sortFilesAlphabetically
    Then the files should be sorted as "001-first.md", "002-second.md", "010-tenth.md"

  Scenario: Sort files with leading zeros in reverse order
    Given I have a MarkdownsPeek instance with sortAlphabetically and reverseSortOrder enabled
    When I set files with leading zeros "001-first.md", "010-tenth.md", "002-second.md"
    And I call sortFilesAlphabetically
    Then the files should be sorted in reverse as "010-tenth.md", "002-second.md", "001-first.md"

