import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/history/history_entry.dart';

part 'history_collection.g.dart';

/// History Collection
@JsonSerializable(includeIfNull: false)
class HistoryHistoryCollection {
  const HistoryHistoryCollection({required this.occurrences});
  final List<HistoryHistoryEntry> occurrences;

  factory HistoryHistoryCollection.fromJson(Map<String, dynamic> json) => _$HistoryHistoryCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$HistoryHistoryCollectionToJson(this);
}
