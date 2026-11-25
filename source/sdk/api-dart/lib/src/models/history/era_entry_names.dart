import 'package:json_annotation/json_annotation.dart';

part 'era_entry_names.g.dart';

/// Era Entry Names
@JsonSerializable(includeIfNull: false)
class HistoryEraEntryNames {
  const HistoryEraEntryNames({
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

  factory HistoryEraEntryNames.fromJson(Map<String, dynamic> json) => _$HistoryEraEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$HistoryEraEntryNamesToJson(this);
}
