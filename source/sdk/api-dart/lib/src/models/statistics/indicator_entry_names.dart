import 'package:json_annotation/json_annotation.dart';

part 'indicator_entry_names.g.dart';

/// Indicator Entry Names
@JsonSerializable(includeIfNull: false)
class StatisticsIndicatorEntryNames {
  const StatisticsIndicatorEntryNames({
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

  factory StatisticsIndicatorEntryNames.fromJson(Map<String, dynamic> json) => _$StatisticsIndicatorEntryNamesFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsIndicatorEntryNamesToJson(this);
}
