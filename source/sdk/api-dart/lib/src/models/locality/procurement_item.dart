import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/locality/evidence_ref.dart';

part 'procurement_item.g.dart';

/// Procurement Item
@JsonSerializable(includeIfNull: false)
class LocalityProcurementItem {
  const LocalityProcurementItem({
    this.amount,
    this.awardedTo,
    this.currency,
    required this.evidence,
    required this.procurementId,
    this.status,
    required this.title,
    this.year,
  });
  final double? amount;
  final String? awardedTo;
  final String? currency;
  final List<LocalityEvidenceRef> evidence;
  final String procurementId;
  final String? status;
  final String title;
  final int? year;

  factory LocalityProcurementItem.fromJson(Map<String, dynamic> json) => _$LocalityProcurementItemFromJson(json);

  Map<String, dynamic> toJson() => _$LocalityProcurementItemToJson(this);
}
