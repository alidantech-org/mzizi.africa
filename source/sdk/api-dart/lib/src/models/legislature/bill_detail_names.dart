import 'package:json_annotation/json_annotation.dart';

part 'bill_detail_names.g.dart';

/// Bill Detail Names
@JsonSerializable(includeIfNull: false)
class LegislatureBillDetailNames {
  const LegislatureBillDetailNames({
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

  factory LegislatureBillDetailNames.fromJson(Map<String, dynamic> json) => _$LegislatureBillDetailNamesFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureBillDetailNamesToJson(this);
}
