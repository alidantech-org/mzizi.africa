import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'deliveries.g.dart';

/// One dated deliverable or milestone under a contract, optionally scoped to a geographic unit.
@JsonSerializable(includeIfNull: false)
class CivicDeliveries {
  const CivicDeliveries({
    this.amountMinorUnits,
    required this.code,
    required this.contractId,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    this.deliveredOn,
    required this.deliveryKindId,
    required this.id,
    this.sourceCitationId,
    this.unitFeatureId,
    required this.updatedAt,
    required this.version,
  });
  final int? amountMinorUnits;
  final String code;
  final String contractId;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final DateTime? deliveredOn;
  final String deliveryKindId;
  final String id;
  final String? sourceCitationId;
  final String? unitFeatureId;
  final DateTime updatedAt;
  final int version;

  factory CivicDeliveries.fromJson(Map<String, dynamic> json) => _$CivicDeliveriesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicDeliveriesToJson(this);
}
