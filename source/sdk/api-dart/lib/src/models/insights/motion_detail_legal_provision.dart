import 'package:json_annotation/json_annotation.dart';

part 'motion_detail_legal_provision.g.dart';

/// Motion Detail Legal Provision
@JsonSerializable(includeIfNull: false)
class InsightsMotionDetailLegalProvision {
  const InsightsMotionDetailLegalProvision({required this.designation, required this.instrument, required this.title});
  final String designation;
  final String instrument;
  final String title;

  factory InsightsMotionDetailLegalProvision.fromJson(Map<String, dynamic> json) => _$InsightsMotionDetailLegalProvisionFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsMotionDetailLegalProvisionToJson(this);
}
