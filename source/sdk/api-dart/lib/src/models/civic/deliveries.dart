import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'deliveries.g.dart';

/// Work delivered and certified under a contract.
@JsonSerializable(includeIfNull: false)
class CivicDeliveries {
  const CivicDeliveries({
    this.amount,
    required this.code,
    required this.contractId,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    this.deliveredOn,
    this.featureId,
    required this.id,
    required this.kindTerm,
    required this.updatedAt,
    required this.version,
  });
  final int? amount;
  final String code;
  final String contractId;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final DateTime? deliveredOn;
  final String? featureId;
  final String id;
  final String kindTerm;
  final DateTime updatedAt;
  final int version;

  factory CivicDeliveries.fromJson(Map<String, dynamic> json) => _$CivicDeliveriesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicDeliveriesToJson(this);
}
