import 'package:json_annotation/json_annotation.dart';

part 'project_detail_names.g.dart';

/// Project Detail Names
@JsonSerializable(includeIfNull: false)
class CivicProjectDetailNames {
  const CivicProjectDetailNames({
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

  factory CivicProjectDetailNames.fromJson(Map<String, dynamic> json) => _$CivicProjectDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicProjectDetailNamesToJson(this);
}
