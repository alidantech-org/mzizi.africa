import 'package:json_annotation/json_annotation.dart';

part 'identity_detail_names.g.dart';

/// Identity Detail Names
@JsonSerializable(includeIfNull: false)
class IdentityIdentityDetailNames {
  const IdentityIdentityDetailNames({
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

  factory IdentityIdentityDetailNames.fromJson(Map<String, dynamic> json) => _$IdentityIdentityDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$IdentityIdentityDetailNamesToJson(this);
}
