import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/motion_detail_legal_fiscal_year.dart';
import 'package:mzizi_api/src/models/insights/motion_detail_legal_provision.dart';

part 'motion_detail_legal.g.dart';

/// Motion Detail Legal
@JsonSerializable(includeIfNull: false)
class InsightsMotionDetailLegal {
  const InsightsMotionDetailLegal({this.fiscalYear, this.provision});
  final InsightsMotionDetailLegalFiscalYear? fiscalYear;
  final InsightsMotionDetailLegalProvision? provision;

  factory InsightsMotionDetailLegal.fromJson(Map<String, dynamic> json) => _$InsightsMotionDetailLegalFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionDetailLegalToJson(this);
}
