import 'package:json_annotation/json_annotation.dart';

part 'source_entry_publisher_names.g.dart';

/// Source Entry Publisher Names
@JsonSerializable(includeIfNull: false)
class SourceSourceEntryPublisherNames {
  const SourceSourceEntryPublisherNames({
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

  factory SourceSourceEntryPublisherNames.fromJson(Map<String, dynamic> json) => _$SourceSourceEntryPublisherNamesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceSourceEntryPublisherNamesToJson(this);
}
