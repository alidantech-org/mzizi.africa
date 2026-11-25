import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/occurrence_entry.dart';

part 'occurrence_collection.g.dart';

/// Occurrence Collection
@JsonSerializable(includeIfNull: false)
class EventOccurrenceCollection {
  const EventOccurrenceCollection({required this.occurrences});
  final List<EventOccurrenceEntry> occurrences;

  factory EventOccurrenceCollection.fromJson(Map<String, dynamic> json) => _$EventOccurrenceCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$EventOccurrenceCollectionToJson(this);
}
