/// Types shared by the Mzizi Flutter components. They hold data only; the generated glue fills them from the
/// contract.
library;

/// One option of a choice field.
class FieldOption {
  const FieldOption({required this.value, required this.label});

  final String value;
  final String label;
}

/// A text field of a filter bar.
class FieldSpec {
  const FieldSpec({required this.name, required this.label});

  final String name;
  final String label;
}

/// One column of a row list: the first is the row's title, the others are shown under it.
class ColumnSpec {
  const ColumnSpec({required this.key, required this.label});

  final String key;
  final String label;
}

/// A page window: how many rows and where they start.
class PageWindow {
  const PageWindow({required this.limit, required this.offset});

  final int limit;
  final int offset;

  PageWindow movedTo(int newOffset) =>
      PageWindow(limit: limit, offset: newOffset < 0 ? 0 : newOffset);
}

/// The names of a paged operation's window inputs and the largest page it serves. Generated per operation.
class PageNames {
  const PageNames({
    required this.limit,
    required this.offset,
    required this.maxLimit,
  });

  /// An operation that is not paged.
  const PageNames.none() : limit = '', offset = '', maxLimit = 0;

  final String limit;
  final String offset;
  final int maxLimit;

  /// Whether the operation serves pages at all.
  bool get isPaged => limit.isNotEmpty;
}
