import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/bids.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/economy/goods.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/reference/units.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'items.g.dart';

/// A line item of a contract or bid.
@JsonSerializable(includeIfNull: false)
class CivicItems {
  const CivicItems({
    this.bidId,
    this.contractId,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    required this.goodId,
    required this.id,
    required this.quantity,
    required this.unitId,
    this.unitPrice,
    required this.updatedAt,
    required this.version,
  });
  final String? bidId;
  final String? contractId;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final String goodId;
  final String id;
  final double quantity;
  final String unitId;
  final int? unitPrice;
  final DateTime updatedAt;
  final int version;

  factory CivicItems.fromJson(Map<String, dynamic> json) => _$CivicItemsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicItemsToJson(this);
}
