import 'package:json_annotation/json_annotation.dart';

part 'indicator_detail_names.g.dart';

/// Indicator Detail Names
@JsonSerializable(includeIfNull: false)
class StatisticsIndicatorDetailNames {
  const StatisticsIndicatorDetailNames({
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

  factory StatisticsIndicatorDetailNames.fromJson(Map<String, dynamic> json) => _$StatisticsIndicatorDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$StatisticsIndicatorDetailNamesToJson(this);
}
