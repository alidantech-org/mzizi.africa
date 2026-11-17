import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// A place, leader, project or GPS spot the visitor keeps.
class SavedItem {
  const SavedItem({
    required this.id,
    required this.title,
    this.subtitle,
    this.featureId,
    this.latitude,
    this.longitude,
  });

  final String id;
  final String title;
  final String? subtitle;
  final String? featureId;
  final double? latitude;
  final double? longitude;

  Map<String, Object?> toJson() => {
    'id': id,
    'title': title,
    'subtitle': subtitle,
    'featureId': featureId,
    'latitude': latitude,
    'longitude': longitude,
  };

  factory SavedItem.fromJson(Map<String, dynamic> json) => SavedItem(
    id: json['id'] as String,
    title: json['title'] as String,
    subtitle: json['subtitle'] as String?,
    featureId: json['featureId'] as String?,
    latitude: (json['latitude'] as num?)?.toDouble(),
    longitude: (json['longitude'] as num?)?.toDouble(),
  );
}

/// Everything kept on the device. Nothing is sent anywhere; likes are personal, not public counts.
class SavedState {
  const SavedState({
    this.places = const [],
    this.leaders = const [],
    this.projects = const [],
    this.spots = const [],
  });

  final List<SavedItem> places;
  final List<SavedItem> leaders;
  final List<SavedItem> projects;
  final List<SavedItem> spots;

  int get count =>
      places.length + leaders.length + projects.length + spots.length;

  Map<String, Object?> toJson() => {
    'places': places.map((e) => e.toJson()).toList(),
    'leaders': leaders.map((e) => e.toJson()).toList(),
    'projects': projects.map((e) => e.toJson()).toList(),
    'spots': spots.map((e) => e.toJson()).toList(),
  };

  static List<SavedItem> _read(Object? raw) => [
    for (final item in (raw as List?) ?? const [])
      SavedItem.fromJson(Map<String, dynamic>.from(item as Map)),
  ];

  factory SavedState.fromJson(Map<String, dynamic> json) => SavedState(
    places: _read(json['places']),
    leaders: _read(json['leaders']),
    projects: _read(json['projects']),
    spots: _read(json['spots']),
  );
}

enum SavedKind { place, leader, project, spot }

/// The saved items, loaded from and written to `shared_preferences`.
class SavedNotifier extends StateNotifier<SavedState> {
  SavedNotifier() : super(const SavedState()) {
    _load();
  }

  static const _key = 'mzizi.saved.v1';

  Future<void> _load() async {
    try {
      final raw = (await SharedPreferences.getInstance()).getString(_key);
      if (raw != null) {
        state = SavedState.fromJson(jsonDecode(raw) as Map<String, dynamic>);
      }
    } catch (_) {
      // Storage can be blocked or hold something else; start empty.
    }
  }

  Future<void> _write(SavedState next) async {
    state = next;
    try {
      await (await SharedPreferences.getInstance()).setString(
        _key,
        jsonEncode(next.toJson()),
      );
    } catch (_) {
      // The choice still holds for this visit.
    }
  }

  List<SavedItem> _of(SavedKind kind) => switch (kind) {
    SavedKind.place => state.places,
    SavedKind.leader => state.leaders,
    SavedKind.project => state.projects,
    SavedKind.spot => state.spots,
  };

  bool has(SavedKind kind, String id) => _of(kind).any((item) => item.id == id);

  /// Adds the item, or removes it when it is already kept.
  void toggle(SavedKind kind, SavedItem item) {
    final current = _of(kind);
    final next = has(kind, item.id)
        ? current.where((e) => e.id != item.id).toList()
        : [item, ...current];
    _write(switch (kind) {
      SavedKind.place => SavedState(
        places: next,
        leaders: state.leaders,
        projects: state.projects,
        spots: state.spots,
      ),
      SavedKind.leader => SavedState(
        places: state.places,
        leaders: next,
        projects: state.projects,
        spots: state.spots,
      ),
      SavedKind.project => SavedState(
        places: state.places,
        leaders: state.leaders,
        projects: next,
        spots: state.spots,
      ),
      SavedKind.spot => SavedState(
        places: state.places,
        leaders: state.leaders,
        projects: state.projects,
        spots: next,
      ),
    });
  }
}

final savedProvider = StateNotifierProvider<SavedNotifier, SavedState>(
  (ref) => SavedNotifier(),
);
