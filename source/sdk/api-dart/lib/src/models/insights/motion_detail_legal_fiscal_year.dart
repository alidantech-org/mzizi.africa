import 'package:json_annotation/json_annotation.dart';

part 'motion_detail_legal_fiscal_year.g.dart';

/// Motion Detail Legal Fiscal Year
@JsonSerializable(includeIfNull: false)
class InsightsMotionDetailLegalFiscalYear {
  const InsightsMotionDetailLegalFiscalYear({required this.code, required this.endsOn, required this.startsOn});
  final String code;

  @JsonKey(name: 'ends_on')
  final String endsOn;

  @JsonKey(name: 'starts_on')
  final String startsOn;

  factory InsightsMotionDetailLegalFiscalYear.fromJson(Map<String, dynamic> json) => _$InsightsMotionDetailLegalFiscalYearFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionDetailLegalFiscalYearToJson(this);
}
