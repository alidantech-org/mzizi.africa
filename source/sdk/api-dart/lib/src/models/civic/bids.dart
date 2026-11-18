import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/procurements.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'bids.g.dart';

/// One supplier submission to one procurement process, with the reported amount and outcome where known.
@JsonSerializable(includeIfNull: false)
class CivicBids {
  const CivicBids({
    this.amountMinorUnits,
    required this.bidderEntityId,
    required this.code,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    required this.id,
    required this.outcomeId,
    required this.procurementId,
    this.sourceCitationId,
    this.submittedOn,
    required this.updatedAt,
    required this.version,
  });
  final int? amountMinorUnits;
  final String bidderEntityId;
  final String code;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final String id;
  final String outcomeId;
  final String procurementId;
  final String? sourceCitationId;
  final DateTime? submittedOn;
  final DateTime updatedAt;
  final int version;

  factory CivicBids.fromJson(Map<String, dynamic> json) => _$CivicBidsFromJson(json);

  Map<String, dynamic> toJson() => _$CivicBidsToJson(this);
}
