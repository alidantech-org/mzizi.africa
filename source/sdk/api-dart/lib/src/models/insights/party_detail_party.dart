import 'package:json_annotation/json_annotation.dart';

part 'party_detail_party.g.dart';

/// Party Detail Party
@JsonSerializable(includeIfNull: false)
class InsightsPartyDetailParty {
  const InsightsPartyDetailParty({required this.code, required this.media, required this.name, this.registeredOn});
  final String code;
  final List<Object?> media;
  final String name;
  final String? registeredOn;

  factory InsightsPartyDetailParty.fromJson(Map<String, dynamic> json) => _$InsightsPartyDetailPartyFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPartyDetailPartyToJson(this);
}
