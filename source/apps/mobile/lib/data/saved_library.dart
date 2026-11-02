import 'package:flutter/foundation.dart';

class SavedEntry {
  const SavedEntry({
    required this.id,
    required this.title,
    required this.type,
    required this.description,
    required this.reference,
  });

  final String id;
  final String title;
  final String type;
  final String description;
  final String reference;
}

class SavedLibrary extends ChangeNotifier {
  SavedLibrary._();

  static final SavedLibrary instance = SavedLibrary._();
  final Map<String, SavedEntry> _entries = {};

  List<SavedEntry> get entries => List.unmodifiable(_entries.values);
  bool contains(String id) => _entries.containsKey(id);

  void toggle(SavedEntry entry) {
    if (!_entries.containsKey(entry.id)) {
      _entries[entry.id] = entry;
    } else {
      _entries.remove(entry.id);
    }
    notifyListeners();
  }

  void remove(String id) {
    if (_entries.remove(id) != null) notifyListeners();
  }
}
