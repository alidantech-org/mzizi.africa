import 'package:json_annotation/json_annotation.dart';

part 'tender_detail_names.g.dart';

/// Tender Detail Names
@JsonSerializable(includeIfNull: false)
class CivicTenderDetailNames {
  const CivicTenderDetailNames({
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

  factory CivicTenderDetailNames.fromJson(Map<String, dynamic> json) => _$CivicTenderDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicTenderDetailNamesToJson(this);
}
