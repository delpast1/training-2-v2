'use strict';

exports = module.exports = (requireSession, app, controllers) => {

    /**
 * @swagger
 * /event/list:
 *   get:
 *     description: show all events in a list
 *     produces:
 *       - application/json
 *     parameters:
 *
 *     responses:
 *       200:
 *         description: Show all events in a list
 */
    app.get('/event/list', controllers.event.listEvents);

       /**
 * @swagger
 * /event/add:
 *   post:
 *     description: Add new event with info
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: Admin's token
 *         in: header
 *         required: true
 *         type: string
 * 
 *       - name: name
 *         description: Event's name
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: desc
 *         description: Event's description
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: date
 *         description: Event's date (mm/dd/yyyy)
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: nA
 *         description: Quantity of Ticket A
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: nB
 *         description: Quantity of Ticket B
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Add a new event
 */
    app.post('/event/add', [requireSession, controllers.event.addEvent]);

      /**
 * @swagger
 * /event/delete:
 *   post:
 *     description: Delete an event
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: Admin's token
 *         in: header
 *         required: true
 *         type: string
 * 
 *       - name: id
 *         description: the _id of event that need to be deleted
 *         in: formData
 *         required: true
 *         type: string
 * 
 *     responses:
 *       200:
 *         description: delete an event for some reasons
 */
    app.post('/event/delete', [requireSession, controllers.event.deleteEvent]);

      /**
 * @swagger
 * /event/purchase:
 *   post:
 *     description: Buy Event's Ticket
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: x-access-token
 *         description: User's token
 *         in: header
 *         required: true
 *         type: string
 * 
 *       - name: id
 *         description: the _id of event
 *         in: formData
 *         required: true
 *         type: string
 * 
 *       - name: kindOfTicket
 *         description: the kind of Ticket
 *         in: formData
 *         required: true
 *         type: string
 * 
 *     responses:
 *       200:
 *         description: delete an event for some reasons
 */
    app.post('/event/purchase', [requireSession, controllers.event.purchaseTicket]);
}