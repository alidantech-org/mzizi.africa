import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/bids.dart';
import 'package:mzizi_api/src/models/civic/contracts.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'partners.g.dart';

/// A party that shares one contract or one bid with the main bidder or contractor: a joint-venture member, a subcontractor or a guarantor.
@JsonSerializable(includeIfNull: false)
class CivicPartners {
  const CivicPartners({
    this.bidId,
    this.contractId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.partnerEntityId,
    required this.roleId,
    this.sharePercentage,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final String? bidId;
  final String? contractId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String partnerEntityId;
  final String roleId;
  final double? sharePercentage;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory CivicPartners.fromJson(Map<String, dynamic> json) => _$CivicPartnersFromJson(json);

  Map<String, dynamic> toJson() => _$CivicPartnersToJson(this);
}
