import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/elections.dart';
import 'package:mzizi_api/src/models/filesystem/versions.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'contributions.g.dart';

/// A political donation or in-kind contribution as disclosed.
@JsonSerializable(includeIfNull: false)
class PoliticsContributions {
  const PoliticsContributions({
    this.amount,
    required this.code,
    required this.createdAt,
    this.currencyId,
    this.deletedAt,
    required this.donorId,
    this.electionId,
    this.givenOn,
    required this.id,
    required this.isInKind,
    required this.recipientId,
    required this.statusTerm,
    required this.updatedAt,
    required this.version,
    this.versionId,
  });
  final int? amount;
  final String code;
  final DateTime createdAt;
  final String? currencyId;
  final DateTime? deletedAt;
  final String donorId;
  final String? electionId;
  final DateTime? givenOn;
  final String id;
  final bool isInKind;
  final String recipientId;
  final String statusTerm;
  final DateTime updatedAt;
  final int version;
  final String? versionId;

  factory PoliticsContributions.fromJson(Map<String, dynamic> json) => _$PoliticsContributionsFromJson(json);

  Map<String, dynamic> toJson() => _$PoliticsContributionsToJson(this);
}
