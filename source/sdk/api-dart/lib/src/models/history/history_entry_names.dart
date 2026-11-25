import 'package:json_annotation/json_annotation.dart';

part 'history_entry_names.g.dart';

/// History Entry Names
@JsonSerializable(includeIfNull: false)
class HistoryHistoryEntryNames {
  const HistoryHistoryEntryNames({
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

  factory HistoryHistoryEntryNames.fromJson(Map<String, dynamic> json) => _$HistoryHistoryEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$HistoryHistoryEntryNamesToJson(this);
}
