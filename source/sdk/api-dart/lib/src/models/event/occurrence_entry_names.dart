import 'package:json_annotation/json_annotation.dart';

part 'occurrence_entry_names.g.dart';

/// Occurrence Entry Names
@JsonSerializable(includeIfNull: false)
class EventOccurrenceEntryNames {
  const EventOccurrenceEntryNames({
    this.fromYear,
    required this.isDefault,
    required this.kindTerm,
    required this.languageCode,
    this.languageIso,
    required this.text,
    this.toYear,
  });
  final int? fromYear;
  final bool isDefault;
  final String kindTerm;
  final String languageCode;
  final String? languageIso;
  final String text;
  final int? toYear;

  factory EventOccurrenceEntryNames.fromJson(Map<String, dynamic> json) => _$EventOccurrenceEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$EventOccurrenceEntryNamesToJson(this);
}
