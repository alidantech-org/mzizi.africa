import 'package:flutter/services.dart';
import 'package:material_ui/material_ui.dart';
import 'package:mzizi_app/presentation/home/locate.dart';
import 'package:mzizi_app/presentation/home/place_picker.dart';
import 'package:mzizi_app/presentation/i18n/strings.dart';
import 'package:mzizi_app/presentation/user/user_store.dart';

/// A bottom sheet with the place picker. With no [onPick] the choice becomes "my place"; with one it is handed back
/// (used when comparing). [locate] adds the "use my location" button.
Future<void> showPlaceSwitcher(
  BuildContext context, {
  String title = 'Choose your place',
  void Function(PickedPlace place)? onPick,
  bool locate = true,
}) {
  return showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    useSafeArea: true,
    showDragHandle: true,
    builder: (sheet) => DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.9,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      builder: (context, controller) => Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 8),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                t(context, title),
                style: Theme.of(context).textTheme.titleLarge,
              ),
            ),
          ),
          Expanded(
            child: PlacePicker(
              scrollController: controller,
              onLocate: locate
                  ? () async {
                      final here = await locateMe();
                      if (here != null && sheet.mounted) {
                        Navigator.of(sheet).pop();
                        await _apply(here, onPick);
                      } else if (sheet.mounted) {
                        ScaffoldMessenger.of(sheet).showSnackBar(
                          SnackBar(
                            content: Text(
                              t(
                                sheet,
                                'We could not read your location. You can allow it in settings, or search for your place below.',
                              ),
                            ),
                          ),
                        );
                      }
                    }
                  : null,
              onPicked: (place) async {
                HapticFeedback.selectionClick();
                Navigator.of(sheet).pop();
                await _apply(place, onPick);
              },
            ),
          ),
        ],
      ),
    ),
  );
}

Future<void> _apply(
  PickedPlace place,
  void Function(PickedPlace)? onPick,
) async {
  if (onPick != null) {
    onPick(place);
  } else {
    await UserStore.instance.setPlace(place.id, place.name, place.kind);
  }
}
