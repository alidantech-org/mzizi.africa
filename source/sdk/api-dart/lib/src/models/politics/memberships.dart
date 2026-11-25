import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/politics/parties.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'memberships.g.dart';

/// A person's dated membership of a party.
@JsonSerializable(includeIfNull: false)
class PoliticsMemberships {
  const PoliticsMemberships({
    required this.createdAt,
    this.deletedAt,
    this.endsOn,
    this.fromYear,
    required this.id,
    required this.individualId,
    required this.kindTerm,
    required this.partyId,
    this.startsOn,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final int? fromYear;
  final String id;
  final String individualId;
  final String kindTerm;
  final String partyId;
  final DateTime? startsOn;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory PoliticsMemberships.fromJson(Map<String, dynamic> json) => _$PoliticsMembershipsFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsMembershipsToJson(this);
}
