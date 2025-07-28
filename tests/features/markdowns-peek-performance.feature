Feature: MarkdownsPeek Performance

  As a developer
  I want to ensure the library performs well
  So that it doesn't impact page performance

  Scenario: Memory usage test
    Given I have multiple MarkdownsPeek instances
    When I create and destroy instances repeatedly
    Then memory usage should remain stable
    And no memory leaks should occur

  Scenario: Initialization speed test
    Given I have a MarkdownsPeek instance
    When I measure initialization time
    Then the initialization should be fast
    And it should complete within reasonable time

  Scenario: Style processing performance test
    Given I have a MarkdownsPeek instance
    When I trigger style processing multiple times
    Then the style processing should be efficient
    And it should not block the main thread 