import 'package:json_annotation/json_annotation.dart';

part 'party_list_parties.g.dart';

/// Party List Parties
@JsonSerializable(includeIfNull: false)
class InsightsPartyListParties {
  const InsightsPartyListParties({
    required this.code,
    this.fundAllocationKes,
    required this.members,
    required this.name,
    required this.officeHolders,
    required this.votes2022,
  });
  final String code;
  final double? fundAllocationKes;
  final double members;
  final String name;
  final double officeHolders;
  final double votes2022;

  factory InsightsPartyListParties.fromJson(Map<String, dynamic> json) => _$InsightsPartyListPartiesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPartyListPartiesToJson(this);
}
