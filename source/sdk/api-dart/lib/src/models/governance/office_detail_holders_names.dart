import 'package:json_annotation/json_annotation.dart';

part 'office_detail_holders_names.g.dart';

/// Office Detail Holders Names
@JsonSerializable(includeIfNull: false)
class GovernanceOfficeDetailHoldersNames {
  const GovernanceOfficeDetailHoldersNames({
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

  factory GovernanceOfficeDetailHoldersNames.fromJson(Map<String, dynamic> json) => _$GovernanceOfficeDetailHoldersNamesFromJson(json);

  Map<String, dynamic> toJson() => _$GovernanceOfficeDetailHoldersNamesToJson(this);
}
