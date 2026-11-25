import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/legislature/bill_detail_names.dart';
import 'package:mzizi_api/src/models/legislature/bill_detail_stages.dart';

part 'bill_detail.g.dart';

/// Bill Detail
@JsonSerializable(includeIfNull: false)
class LegislatureBillDetail {
  const LegislatureBillDetail({
    required this.billId,
    required this.code,
    required this.institutionId,
    this.instrumentId,
    required this.kindTerm,
    required this.names,
    this.sponsorId,
    required this.stages,
    required this.statusTerm,
  });
  final String billId;
  final String code;
  final String institutionId;
  final String? instrumentId;
  final String kindTerm;
  final List<LegislatureBillDetailNames> names;
  final String? sponsorId;
  final List<LegislatureBillDetailStages> stages;
  final String statusTerm;

  factory LegislatureBillDetail.fromJson(Map<String, dynamic> json) => _$LegislatureBillDetailFromJson(json);

  Map<String, dynamic> toJson() => _$LegislatureBillDetailToJson(this);
}
