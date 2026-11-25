import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/procurements.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'bids.g.dart';

/// A bid on a tender, including cheaper bids that lost.
@JsonSerializable(includeIfNull: false)
class CivicBids {
  const CivicBids({
    this.amount,
    required this.bidderId,
    required this.code,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    required this.id,
    required this.outcomeTerm,
    required this.procurementId,
    this.submittedOn,
    required this.updatedAt,
    required this.version,
  });
  final int? amount;
  final String bidderId;
  final String code;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final String id;
  final String outcomeTerm;
  final String procurementId;
  final DateTime? submittedOn;
  final DateTime updatedAt;
  final int version;

  factory CivicBids.fromJson(Map<String, dynamic> json) => _$CivicBidsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicBidsToJson(this);
}
