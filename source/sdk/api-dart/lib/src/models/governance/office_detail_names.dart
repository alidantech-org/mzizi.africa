import 'package:json_annotation/json_annotation.dart';

part 'office_detail_names.g.dart';

/// Office Detail Names
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeDetailNames {
  const GovernanceOfficeDetailNames({
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

  factory GovernanceOfficeDetailNames.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeDetailNamesToJson(this);
}
